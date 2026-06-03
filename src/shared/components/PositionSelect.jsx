import React, { Component } from 'react';
import { Field } from 'react-final-form';
import styles from './PositionSelect.module.css';

class PositionSelect extends Component {
  constructor(props) {
    super(props);

    this.dropdownRef = React.createRef();
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleDocumentMouseDown);
    document.addEventListener('keydown', this.handleDocumentKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleDocumentMouseDown);
    document.removeEventListener('keydown', this.handleDocumentKeyDown);
  }

  handleDocumentMouseDown = (event) => {
    if (!this.state.isOpen) {
      return;
    }

    if (!this.dropdownRef.current?.contains(event.target)) {
      this.setState({
        isOpen: false,
      });
    }
  };

  handleDocumentKeyDown = (event) => {
    if (event.key !== 'Escape' || !this.state.isOpen) {
      return;
    }

    this.setState({
      isOpen: false,
    });
  };

  toggleDropdown = () => {
    this.setState((previousState) => ({
      isOpen: !previousState.isOpen,
    }));
  };

  render() {
    const { label, options, fieldName, meta, values } = this.props;
    const fieldError =
      meta.touched || meta.submitFailed ? meta.error || meta.submitError : '';
    const selectedValues = Array.isArray(values[fieldName]) ? values[fieldName] : [];
    const optionLabelMap = new Map(options.map((option) => [option.key, option.label]));
    const selectedLabels = selectedValues.map((value) => optionLabelMap.get(value) ?? value);
    const triggerLabel =
      selectedLabels.length > 0 ? selectedLabels.join(', ') : `Select ${label.toLowerCase()}`;

    return (
      <div className={styles.dropdownFieldGroup} ref={this.dropdownRef}>
        <span className={styles.fieldLabel}>{label}</span>
        <div className={styles.dropdownControl}>
          <button
            className={styles.dropdownTrigger}
            type="button"
            onClick={this.toggleDropdown}
            aria-expanded={this.state.isOpen}
          >
            <span className={styles.dropdownTriggerText}>{triggerLabel}</span>
            <span className={styles.dropdownTriggerIcon}>
              {this.state.isOpen ? 'Hide' : 'Select'}
            </span>
          </button>
          <div
            className={
              this.state.isOpen ? styles.dropdownPanelOpen : styles.dropdownPanel
            }
          >
            <div className={styles.dropdownOptionGrid}>
              {options.map((option) => (
                <label key={option.key} className={styles.checkboxItem}>
                  <Field
                    name={fieldName}
                    component="input"
                    type="checkbox"
                    value={option.key}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <p className={styles.fieldError}>{fieldError}</p>
      </div>
    );
  }
}

export default PositionSelect;
