import { useMemo, useRef } from 'react';
import { Form, Field } from 'react-final-form';
import { POSITIONS } from '../../auth/constants/positions';
import TextField from '../../../shared/components/TextField';
import PositionSelect from '../../../shared/components/PositionSelect';
import ProfileTextareaField from './form-fields/ProfileTextareaField';
import AvatarUploadField from './form-fields/AvatarUploadField';
import HighlightImagesUploadField from './form-fields/HighlightImagesUploadField';
import StatusToggleField from './form-fields/StatusToggleField';
import styles from './ProfileForm.module.css';

const POSITION_ORDER = new Map(POSITIONS.map((position, index) => [position.key, index]));

function sortPositionKeys(positionKeys) {
  return [...new Set(positionKeys)].sort(
    (left, right) => (POSITION_ORDER.get(left) ?? Number.MAX_SAFE_INTEGER) - (POSITION_ORDER.get(right) ?? Number.MAX_SAFE_INTEGER),
  );
}

function normalizePositionValue(positionValue) {
  const rawValues = Array.isArray(positionValue)
    ? positionValue
    : String(positionValue ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

  const normalizedKeys = rawValues
    .map((value) => {
              const normalizedValue = String(value ?? '').trim().toLowerCase();
              if (!normalizedValue) return '';

              const match = POSITIONS.find(
                (p) => p.key.toLowerCase() === normalizedValue || p.label.toLowerCase() === normalizedValue
              );
              return match ? match.key : '';
    })
    .filter(Boolean);

  return sortPositionKeys(normalizedKeys);
}

function serializePositionValue(positionValue) {
  return normalizePositionValue(positionValue).join(', ');
}

function normalizeDob(dob) {
  if (!dob) return '';
  const match = String(dob).match(/^(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : '';
}

function normalizeTextValue(value) {
  return String(value ?? '').trim();
}

function createInitialValues(profile) {
  return {
    avatar: {
      existingUrl: profile?.avatar_url || '',
      newFile: null,
    },
    name: profile?.name || '',
    dob: normalizeDob(profile?.dob),
    position: normalizePositionValue(profile?.position),
    bio: profile?.bio || '',
    highlightImages: {
      existingUrls: Array.isArray(profile?.highlight_images) ? profile.highlight_images : [],
      removedUrls: [],
      newFiles: [],
    },
    status: profile?.status || 'active',
  };
}

function hasAvatarValue(value) {
  return Boolean(value?.existingUrl || value?.newFile);
}

function getActiveHighlightCount(value) {
  const existingUrls = Array.isArray(value?.existingUrls) ? value.existingUrls : [];
  const removedUrls = new Set(Array.isArray(value?.removedUrls) ? value.removedUrls : []);
  const remainingExistingCount = existingUrls.filter((url) => !removedUrls.has(url)).length;
  const newFilesCount = Array.isArray(value?.newFiles) ? value.newFiles.length : 0;

  return remainingExistingCount + newFilesCount;
}

function validateDob(value) {
  const normalizedValue = String(value ?? '').trim();

  if (!normalizedValue) {
    return 'Date of birth is required.';
  }

  const match = normalizedValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return 'Enter a valid date in YYYY-MM-DD format.';
  }

  const [, yearString, monthString, dayString] = match;
  const year = Number(yearString);
  const month = Number(monthString);
  const day = Number(dayString);

  const candidateDate = new Date(Date.UTC(year, month - 1, day));

  if (
    Number.isNaN(candidateDate.getTime()) ||
    candidateDate.getUTCFullYear() !== year ||
    candidateDate.getUTCMonth() !== month - 1 ||
    candidateDate.getUTCDate() !== day
  ) {
    return 'Enter a valid calendar date.';
  }

  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));

  if (candidateDate > todayUtc) {
    return 'Date of birth cannot be in the future.';
  }

  return '';
}

function validateProfileForm(values) {
  const errors = {};

  if (!hasAvatarValue(values.avatar)) {
    errors.avatar = 'Avatar is required.';
  }

  if (!String(values.name ?? '').trim()) {
    errors.name = 'Name is required.';
  }

  const dobError = validateDob(values.dob);
  if (dobError) {
    errors.dob = dobError;
  }

  if (!Array.isArray(values.position) || values.position.length === 0) {
    errors.position = 'Position is required.';
  }

  if (getActiveHighlightCount(values.highlightImages) === 0) {
    errors.highlightImages = 'At least one highlight image is required.';
  }

  return errors;
}

function areListsEqual(left, right) {
  const normalizedLeft = [...left];
  const normalizedRight = [...right];

  if (normalizedLeft.length !== normalizedRight.length) {
    return false;
  }

  return normalizedLeft.every((value, index) => value === normalizedRight[index]);
}

function getFileSignature(file) {
  if (!file) {
    return '';
  }

  return `${file.name}-${file.size}-${file.lastModified}`;
}

function normalizeAvatarForComparison(avatarValue) {
  if (avatarValue?.newFile) {
    return '__NEW_FILE__';
  }

  return normalizeTextValue(avatarValue?.existingUrl);
}

function normalizeHighlightsForComparison(highlightImages = {}) {
  const existingUrls = Array.isArray(highlightImages.existingUrls)
    ? highlightImages.existingUrls.map(normalizeTextValue).filter(Boolean).sort()
    : [];
  const removedUrls = Array.isArray(highlightImages.removedUrls)
    ? highlightImages.removedUrls.map(normalizeTextValue).filter(Boolean).sort()
    : [];
  const removedUrlSet = new Set(removedUrls);
  const visibleExistingUrls = existingUrls.filter((imageUrl) => !removedUrlSet.has(imageUrl));
  const newFileSignatures = Array.isArray(highlightImages.newFiles)
    ? highlightImages.newFiles.map(getFileSignature).filter(Boolean).sort()
    : [];

  return {
    existingUrls: visibleExistingUrls,
    removedUrls,
    newFiles: newFileSignatures,
  };
}

function normalizeComparableValues(values = {}) {
  return {
    name: normalizeTextValue(values.name),
    dob: normalizeDob(values.dob),
    position: normalizePositionValue(values.position),
    bio: normalizeTextValue(values.bio),
    status: normalizeTextValue(values.status || 'active'),
    avatar: normalizeAvatarForComparison(values.avatar),
    highlightImages: normalizeHighlightsForComparison(values.highlightImages),
  };
}

function areComparableValuesEqual(left, right) {
  return (
    left.name === right.name &&
    left.dob === right.dob &&
    areListsEqual(left.position, right.position) &&
    left.bio === right.bio &&
    left.status === right.status &&
    left.avatar === right.avatar &&
    areListsEqual(left.highlightImages.existingUrls, right.highlightImages.existingUrls) &&
    areListsEqual(left.highlightImages.removedUrls, right.highlightImages.removedUrls) &&
    areListsEqual(left.highlightImages.newFiles, right.highlightImages.newFiles)
  );
}

function ProfileForm({ profile, isSubmitting, submitError, onSubmit }) {
  const profileKey = profile?.id ?? '';
  const initialValuesRef = useRef({
    profileKey,
    values: createInitialValues(profile),
  });

  if (initialValuesRef.current.profileKey !== profileKey) {
    initialValuesRef.current = {
      profileKey,
      values: createInitialValues(profile),
    };
  }

  const initialValues = initialValuesRef.current.values;
  const normalizedInitialValues = useMemo(
    () => normalizeComparableValues(initialValues),
    [initialValues],
  );

  async function handleSubmit(values) {
    return onSubmit({
      profileData: {
        name: values.name,
        dob: values.dob,
        position: serializePositionValue(values.position),
        bio: values.bio,
        status: values.status,
      },
      avatarFile: values.avatar?.newFile ?? null,
      removedHighlightUrls: values.highlightImages?.removedUrls ?? [],
      existingHighlightUrls: (values.highlightImages?.existingUrls ?? []).filter(
        (imageUrl) => !(values.highlightImages?.removedUrls ?? []).includes(imageUrl),
      ),
      newHighlightFiles: values.highlightImages?.newFiles ?? [],
    });
  }

  return (
    <Form
      initialValues={initialValues}
      validate={validateProfileForm}
      keepDirtyOnReinitialize={false}
      onSubmit={handleSubmit}
      render={({ handleSubmit: submitForm, invalid, submitError: formSubmitError, values }) => {
        const normalizedCurrentValues = normalizeComparableValues(values);
        const hasChanges = !areComparableValuesEqual(
          normalizedCurrentValues,
          normalizedInitialValues,
        );
        const isSaveDisabled = isSubmitting || invalid || !hasChanges;

        return (
          <form className={styles.formCard} onSubmit={submitForm}>
            <div className={styles.formGrid}>
              <Field name="avatar" component={AvatarUploadField} label="Avatar" />
              <Field name="name" component={TextField} label="Name" placeholder="Enter your name" />
              <Field name="dob" component={TextField} label="Date of birth" type="date" />
              <Field
                name="position"
                subscription={{
                  touched: true,
                  error: true,
                  submitError: true,
                  submitFailed: true,
                }}
              >
                {({ meta }) => (
                  <PositionSelect
                    label="Position"
                    fieldName="position"
                    options={POSITIONS}
                    meta={meta}
                    values={values}
                  />
                )}
              </Field>
              <Field
                name="bio"
                component={ProfileTextareaField}
                label="Bio"
                placeholder="Tell people a little about yourself"
                rows={6}
              />
              <Field name="highlightImages" component={HighlightImagesUploadField} label="Highlight images" />
              <Field name="status" component={StatusToggleField} label="Status" />
            </div>

            {submitError || formSubmitError ? (
              <p className={styles.submitError}>{submitError || formSubmitError}</p>
            ) : null}

            <div className={styles.actions}>
              <button
                className={styles.saveButton}
                type="submit"
                disabled={isSaveDisabled}
              >
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        );
      }}
    />
  );
}

export default ProfileForm;
