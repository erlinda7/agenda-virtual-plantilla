
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export function confirmDelete(callback) {
    return confirmAlert({
      title: 'Are you sure you want to delete this contact ?',
      message: 'This cannot be reverted',
      buttons: [
        {
          label: "Yes, I'm sure!",
          onClick: () => {
            callback();
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  }

  export function confirmBlocked(callback) {
    return confirmAlert({
      title: 'Are you sure you want to block this contact ?',
      message: 'This cannot be reverted',
      buttons: [
        {
          label: "Yes, I'm sure!",
          onClick: () => {
            callback();
          },
        },
        {
          label: 'Cancel',
        },
      ],
    });
  }