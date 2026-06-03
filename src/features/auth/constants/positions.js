export const POSITIONS = [
  { key: 'fe_developer', label: 'FE developer' },
  { key: 'be_developer', label: 'BE developer' },
  { key: 'fullstack', label: 'Fullstack' },
  { key: 'designers', label: 'Designers' },
  { key: 'admin', label: 'Admin' },
  { key: 'hr', label: 'HR' },
  { key: 'ba', label: 'BA' },
  { key: 'pm', label: 'PM' },
  { key: 'testers', label: 'Testers' },
];

export function getPositionLabel(positionKey) {
  return POSITIONS.find((position) => position.key === positionKey)?.label ?? positionKey;
}

export function getPositionLabels(positionKeys) {
  return positionKeys.map((positionKey) => getPositionLabel(positionKey));
}
