import { toast } from 'react-hot-toast';

const EmailRegx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PhoneRegx = /^\d{10}$/;

class FormUtility {
  IsEmpty = (value) => value.trim() === '';

  IsMobileValid = (phone) => PhoneRegx.test(phone);

  IsEmailValid = (email) => EmailRegx.test(email);

  ErrorToast = (msg) =>
    toast.error(msg, {
      style: {
        border: '1px solid #ff0033',
        padding: '16px',
        color: '#ff0033',
      },
      iconTheme: {
        primary: '#ff0033',
        secondary: '#FFFAEE',
      },
    });

  SuccessToast = (msg) =>
    toast.success(msg, {
      style: {
        border: '1px solid #4BB543',
        padding: '16px',
        color: '#4BB543',
      },
      iconTheme: {
        primary: '#4BB543',
        secondary: '#FFFAEE',
      },
    });

  NormalizePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('0') ? '88' + cleaned : cleaned;
  };

  ImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject('Invalid image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // includes prefix
      reader.onerror = () => reject('Failed to convert image');
      reader.readAsDataURL(file);
    });
  };
}

export const {
  IsEmpty,
  IsMobileValid,
  IsEmailValid,
  ErrorToast,
  SuccessToast,
  NormalizePhone,
  ImageToBase64,
} = new FormUtility();
