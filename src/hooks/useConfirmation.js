import { useState } from 'react';

const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmButtonColor: 'red'
  });

  const showConfirmation = ({ 
    title = "Confirm Action", 
    message = "Are you sure you want to proceed?",
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmButtonColor = "red"
  }) => {
    setConfirmationState({
      isOpen: true,
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
      confirmButtonColor
    });
  };

  const hideConfirmation = () => {
    setConfirmationState(prev => ({
      ...prev,
      isOpen: false
    }));
  };

  const handleConfirm = () => {
    if (confirmationState.onConfirm) {
      confirmationState.onConfirm();
    }
    hideConfirmation();
  };

  return {
    confirmationState,
    showConfirmation,
    hideConfirmation,
    handleConfirm
  };
};

export default useConfirmation;