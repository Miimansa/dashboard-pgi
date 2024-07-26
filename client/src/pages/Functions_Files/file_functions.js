import toast from 'react-hot-toast';
const notify_error = (message) => toast.error(message,
    {
        duration: 2000,
        position: "top-center",
    }
);
const notify_success = (message) => toast.success(message,
    {
        duration: 2000,
        position: "top-center",
    }
);
const convertObject = (obj, section) => {
    const convertedObject = {};
    convertedObject[section] = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            convertedObject[section][key] = { SelectedType: obj[key].value };
        }
    }
    return convertedObject;
};
const formatDataForPieChart = (data) => {
    if (!data || !Array.isArray(data)) {
        console.error('Invalid data passed to formatDataForPieChart:', data);
        return null;
    }
    const values = data.map(({ value }) => value);
    const labels = data.map(({ name }) => name);
    // console.log(values)
    // console.log(labels)
    return [{
        values,
        labels
    }];
};
export { notify_error, notify_success, convertObject, formatDataForPieChart }