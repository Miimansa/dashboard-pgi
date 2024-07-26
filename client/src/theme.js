const setDefaultTheme = () => {
  document.documentElement.style.setProperty('--primary-color-background', '#F8B34B');
  document.documentElement.style.setProperty('--secondary-color-background', '#ffffff');
  document.documentElement.style.setProperty('--hover-color-background', '#d99a4e');
  document.documentElement.style.setProperty('--tablehead-background-color', 'rgb(221, 217, 217)');
  document.documentElement.style.setProperty('--primary-color-background-input', '#e1d5c7');
  document.documentElement.style.setProperty('--primary-color-text', '#ffffff');
  document.documentElement.style.setProperty('--secondary-color-text', '#000000');
  document.documentElement.style.setProperty('--arrow-color', '#5b3112');
  document.documentElement.style.setProperty('--box-shadow-color', 'rgba(0, 0, 0, 0.35)');
  document.documentElement.style.setProperty('--border-color', 'rgb(32, 125, 248)');
  document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, rgba(243, 169, 28, 1) 17%, rgba(255, 183, 48, 1) 34%, rgba(255, 183, 48, 1) 34%, rgba(254, 207, 121, 1) 53%, rgba(247, 201, 115, 1) 80%, rgba(196, 153, 69, 1) 96%, rgba(191, 148, 65, 1) 100%)');
};

const setDarkTheme = () => {
  document.documentElement.style.setProperty('--primary-color-background', '#2c3e50');
  document.documentElement.style.setProperty('--secondary-color-background', '#34495e');
  document.documentElement.style.setProperty('--hover-color-background', '#46627f');
  document.documentElement.style.setProperty('--tablehead-background-color', '#576574');
  document.documentElement.style.setProperty('--primary-color-background-input', '#465c6f');
  document.documentElement.style.setProperty('--primary-color-text', '#ecf0f1');
  document.documentElement.style.setProperty('--secondary-color-text', '#bdc3c7');
  document.documentElement.style.setProperty('--arrow-color', '#95a5a6');
  document.documentElement.style.setProperty('--box-shadow-color', 'rgba(0, 0, 0, 0.5)');
  document.documentElement.style.setProperty('--border-color', '#3498db');
  document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)');
};

const setLightTheme = () => {
  document.documentElement.style.setProperty('--primary-color-background', '#3498db');
  document.documentElement.style.setProperty('--secondary-color-background', '#ecf0f1');
  document.documentElement.style.setProperty('--hover-color-background', '#2980b9');
  document.documentElement.style.setProperty('--tablehead-background-color', '#bdc3c7');
  document.documentElement.style.setProperty('--primary-color-background-input', '#d6eaf8');
  document.documentElement.style.setProperty('--primary-color-text', '#ffffff');
  document.documentElement.style.setProperty('--secondary-color-text', '#2c3e50');
  document.documentElement.style.setProperty('--arrow-color', '#34495e');
  document.documentElement.style.setProperty('--box-shadow-color', 'rgba(52, 152, 219, 0.35)');
  document.documentElement.style.setProperty('--border-color', '#e74c3c');
  document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #3498db 0%, #ecf0f1 50%, #3498db 100%)');
};

const setNatureTheme = () => {
  document.documentElement.style.setProperty('--primary-color-background', '#27ae60');
  document.documentElement.style.setProperty('--secondary-color-background', '#f1f8e9');
  document.documentElement.style.setProperty('--hover-color-background', '#2ecc71');
  document.documentElement.style.setProperty('--tablehead-background-color', '#c8e6c9');
  document.documentElement.style.setProperty('--primary-color-background-input', '#e8f5e9');
  document.documentElement.style.setProperty('--primary-color-text', '#ffffff');
  document.documentElement.style.setProperty('--secondary-color-text', '#1e3a1e');
  document.documentElement.style.setProperty('--arrow-color', '#1e8449');
  document.documentElement.style.setProperty('--box-shadow-color', 'rgba(46, 204, 113, 0.35)');
  document.documentElement.style.setProperty('--border-color', '#8bc34a');
  document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #27ae60 0%, #f1f8e9 50%, #27ae60 100%)');
};

const setDarkTheme2 = () => {
  document.documentElement.style.setProperty('--primary-color-background', '#1b262c');
  document.documentElement.style.setProperty('--secondary-color-background', '#0f4c75');
  document.documentElement.style.setProperty('--hover-color-background', '#3282b8');
  document.documentElement.style.setProperty('--tablehead-background-color', '#bbe1fa');
  document.documentElement.style.setProperty('--primary-color-background-input', '#1b262c');
  document.documentElement.style.setProperty('--primary-color-text', '#bbe1fa');
  document.documentElement.style.setProperty('--secondary-color-text', '#0f4c75');
  document.documentElement.style.setProperty('--arrow-color', '#bbe1fa');
  document.documentElement.style.setProperty('--box-shadow-color', 'rgba(27, 38, 44, 0.5)');
  document.documentElement.style.setProperty('--border-color', '#3282b8');
  document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #1b262c 0%, #0f4c75 50%, #1b262c 100%)');
};

const setLightTheme2 = () => {
  document.documentElement.style.setProperty('--primary-color-background', '#ffcc80');
  document.documentElement.style.setProperty('--secondary-color-background', '#fff3e0');
  document.documentElement.style.setProperty('--hover-color-background', '#ffb74d');
  document.documentElement.style.setProperty('--tablehead-background-color', '#ffe0b2');
  document.documentElement.style.setProperty('--primary-color-background-input', '#ffe0b2');
  document.documentElement.style.setProperty('--primary-color-text', '#ffffff');
  document.documentElement.style.setProperty('--secondary-color-text', '#5d4037');
  document.documentElement.style.setProperty('--arrow-color', '#ffcc80');
  document.documentElement.style.setProperty('--box-shadow-color', 'rgba(255, 204, 128, 0.35)');
  document.documentElement.style.setProperty('--border-color', '#ff8a65');
  document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #ffcc80 0%, #fff3e0 50%, #ffcc80 100%)');
};

export { setDarkTheme, setDefaultTheme, setLightTheme, setNatureTheme, setDarkTheme2, setLightTheme2 };
