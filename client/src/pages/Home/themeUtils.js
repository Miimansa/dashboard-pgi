const setDefaultTheme = () => {
    document.documentElement.style.setProperty('--primary-color-background', '#F8B34B');
    document.documentElement.style.setProperty('--secondary-color-background', '#ffffff');
    document.documentElement.style.setProperty('--hover-color-background', '#d99a4e');
    document.documentElement.style.setProperty('--tablehead-background-color', 'rgb(221, 217, 217)');
    document.documentElement.style.setProperty('--primary-color-background-input', '#e1d5c7');
    document.documentElement.style.setProperty('--primary-color-text', '#ffffff');
    document.documentElement.style.setProperty('--secondary-color-text', '#000000');
    document.documentElement.style.setProperty('--arrow-color', '#5b3112');
    document.documentElement.style.setProperty('--primary-color-background_container', '#ffffff');
    document.documentElement.style.setProperty('--box-shadow-color', 'rgba(0, 0, 0, 0.35)');
    document.documentElement.style.setProperty('--border-color', 'rgb(32, 125, 248)');
    document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #F8B34B 0%, #d99a4e 50%, #F8B34B 100%)');
    document.documentElement.style.setProperty('--plotly-background-color', '#ffffff');
    document.documentElement.style.setProperty('--plotly-text-color', '#000000');
    document.documentElement.style.setProperty('--plotly-legend-background-color', 'rgba(248, 179, 75, 0.25)')
    document.documentElement.style.setProperty('--plotly-legend-border-color', '#d99a4e');
    document.documentElement.style.setProperty('--sidebar-shadow', '#000000');
};

const setDarkTheme = () => {
    document.documentElement.style.setProperty('--primary-color-background', '#000000');
    document.documentElement.style.setProperty('--secondary-color-background', '#3d3b5a');
    document.documentElement.style.setProperty('--hover-color-background', '#4e4872');
    document.documentElement.style.setProperty('--tablehead-background-color', '#6a6782');
    document.documentElement.style.setProperty('--primary-color-background-input', '#3d3b5a');
    document.documentElement.style.setProperty('--primary-color-text', '#ecf0f1');
    document.documentElement.style.setProperty('--secondary-color-text', '#bdc3c7');
    document.documentElement.style.setProperty('--primary-color-background_container', '#000000');
    document.documentElement.style.setProperty('--arrow-color', '#a29bfe');
    document.documentElement.style.setProperty('--box-shadow-color', 'rgba(0, 0, 0, 0.5)');
    document.documentElement.style.setProperty('--border-color', '#8e44ad');
    document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #000000 0%, #4e4872 50%, #000000 100%)');
    document.documentElement.style.setProperty('--plotly-background-color', '#000000');
    document.documentElement.style.setProperty('--plotly-text-color', '#ecf0f1');
    document.documentElement.style.setProperty('--plotly-legend-background-color', 'rgba(61, 59, 90, 0.25)');
    document.documentElement.style.setProperty('--plotly-legend-border-color', '#4e4872');
    document.documentElement.style.setProperty('--sidebar-shadow', '#939090');
};

const setLightTheme = () => {
    document.documentElement.style.setProperty('--primary-color-background', '#EDEDE9');
    document.documentElement.style.setProperty('--secondary-color-background', '#F5EBE0');
    document.documentElement.style.setProperty('--hover-color-background', '#E3D5CA');
    document.documentElement.style.setProperty('--tablehead-background-color', '#D6CCC2');
    document.documentElement.style.setProperty('--primary-color-background-input', '#E3D5CA');
    document.documentElement.style.setProperty('--primary-color-background_container', '#EDEDE9');
    document.documentElement.style.setProperty('--primary-color-text', '#2c3e50');
    document.documentElement.style.setProperty('--secondary-color-text', '#000000');
    document.documentElement.style.setProperty('--arrow-color', '#8a8579');
    document.documentElement.style.setProperty('--box-shadow-color', 'rgba(0, 0, 0, 0.2)');
    document.documentElement.style.setProperty('--border-color', '#D5BDAF');
    document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #EDEDE9 0%, #D6CCC2 25%, #F5EBE0 50%, #E3D5CA 75%, #D5BDAF 100%)');
    document.documentElement.style.setProperty('--plotly-background-color', '#ffffff');
    document.documentElement.style.setProperty('--plotly-text-color', '#2c3e50');
    document.documentElement.style.setProperty('--plotly-legend-background-color', 'rgba(237, 237, 233, 0.25)');
    document.documentElement.style.setProperty('--plotly-legend-border-color', '#D6CCC2');
};

const setNatureTheme = () => {
    document.documentElement.style.setProperty('--primary-color-background', '#27ae60');
    document.documentElement.style.setProperty('--primary-color-background_container', '#27ae60');
    document.documentElement.style.setProperty('--secondary-color-background', '#f1f8e9');
    document.documentElement.style.setProperty('--hover-color-background', '#2ecc71');
    document.documentElement.style.setProperty('--tablehead-background-color', '#c8e6c9');
    document.documentElement.style.setProperty('--primary-color-background-input', '#e8f5e9');
    document.documentElement.style.setProperty('--primary-color-text', '#ffffff');
    document.documentElement.style.setProperty('--secondary-color-text', '#1e3a1e');
    document.documentElement.style.setProperty('--arrow-color', '#1e8449');
    document.documentElement.style.setProperty('--box-shadow-color', 'rgba(46, 204, 113, 0.35)');
    document.documentElement.style.setProperty('--border-color', '#8bc34a');
    document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #27ae60 0%, #2ecc71 50%, #27ae60 100%)');
    document.documentElement.style.setProperty('--plotly-background-color', '#f1f8e9');
    document.documentElement.style.setProperty('--plotly-text-color', '#1e3a1e');
    document.documentElement.style.setProperty('--plotly-legend-background-color', 'rgba(39, 174, 96, 0.25)');
    document.documentElement.style.setProperty('--plotly-legend-border-color', '#2ecc71');
};

const setDarkTheme2 = () => {
    document.documentElement.style.setProperty('--primary-color-background', '#1b262c');
    document.documentElement.style.setProperty('--primary-color-background_container', '#1b262c');
    document.documentElement.style.setProperty('--secondary-color-background', '#0f4c75');
    document.documentElement.style.setProperty('--hover-color-background', '#3282b8');
    document.documentElement.style.setProperty('--tablehead-background-color', '#bbe1fa');
    document.documentElement.style.setProperty('--primary-color-background-input', '#1b262c');
    document.documentElement.style.setProperty('--primary-color-text', '#bbe1fa');
    document.documentElement.style.setProperty('--secondary-color-text', '#0f4c75');
    document.documentElement.style.setProperty('--arrow-color', '#bbe1fa');
    document.documentElement.style.setProperty('--box-shadow-color', 'rgba(27, 38, 44, 0.5)');
    document.documentElement.style.setProperty('--border-color', '#3282b8');
    document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #1b262c 0%, #3282b8 50%, #1b262c 100%)');
    document.documentElement.style.setProperty('--plotly-background-color', '#1b262c');
    document.documentElement.style.setProperty('--plotly-text-color', '#bbe1fa');
    document.documentElement.style.setProperty('--plotly-legend-background-color', 'rgba(15, 76, 117, 0.25)');
    document.documentElement.style.setProperty('--plotly-legend-border-color', '#3282b8');
    document.documentElement.style.setProperty('--sidebar-shadow', '#939090');
};

const setLightTheme2 = () => {
    document.documentElement.style.setProperty('--primary-color-background', '#D6F8F7');
    document.documentElement.style.setProperty('--primary-color-background_container', '#D6F8F7');
    document.documentElement.style.setProperty('--secondary-color-background', '#FFFFFF');
    document.documentElement.style.setProperty('--hover-color-background', '#B3E6E4');
    document.documentElement.style.setProperty('--tablehead-background-color', '#CFEFEF');
    document.documentElement.style.setProperty('--primary-color-background-input', '#E0FCFB');
    document.documentElement.style.setProperty('--primary-color-text', '#13C6B3');
    document.documentElement.style.setProperty('--secondary-color-text', '#000000');
    document.documentElement.style.setProperty('--arrow-color', '#13C6B3');
    document.documentElement.style.setProperty('--box-shadow-color', 'rgba(19, 198, 179, 0.35)');
    document.documentElement.style.setProperty('--border-color', '#13C6B3');
    document.documentElement.style.setProperty('--gradient-background', 'linear-gradient(90deg, #D6F8F7 0%, #B3E6E4 50%, #D6F8F7 100%)');
    document.documentElement.style.setProperty('--plotly-background-color', '#ffffff');
    document.documentElement.style.setProperty('--plotly-text-color', '#13C6B3');
    document.documentElement.style.setProperty('--plotly-legend-background-color', 'rgba(214, 248, 247, 0.25)');
    document.documentElement.style.setProperty('--plotly-legend-border-color', '#B3E6E4');
    document.documentElement.style.setProperty('--sidebar-shadow', '#000000');
};

const setTheme = (userTheme) => {
    switch (userTheme) {
        case 'dark':
            setDarkTheme();
            break;
        case 'light':
            setLightTheme();
            break;
        case 'dark 2':
            setDarkTheme2();
            break;
        case 'light 2':
            setLightTheme2();
            break;
        default:
            setDefaultTheme();
    }
}
export { setDarkTheme, setDefaultTheme, setLightTheme, setNatureTheme, setDarkTheme2, setLightTheme2, setTheme };
