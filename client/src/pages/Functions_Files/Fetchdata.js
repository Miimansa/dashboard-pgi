import axios from "axios";
import { get_lab_agg_url,get_emergency_agg_url,get_resources_agg_url,update_default_values,get_default_values,get_visit_url,get_discharge_type_url,homedata_url, get_dept_url, signup_url, opt_url, login_url, resend_opt_url, update_user_url, update_usertheme_url, validuser_url, labdata_url, resources_url, emergency_url, disease_url, get_test_type_url, request_pass_url, verify_request_url, changepass_url,newPassword_url } from "./API";

// Function to get home data through axios
const getdata_home = async (date_from, date_to, department_names, grouping_type, token) => {
    const url = `${homedata_url}?date_from=${date_from}&date_to=${date_to}&department_names=${department_names}&grouping_type=${grouping_type}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
};
const getMultiData = async (date_from, date_to, departments, genders,visitTypes, factor,grouping_type,token) => {
    const url = `${get_visit_url}?date_from=${date_from}&date_to=${date_to}&departments=${departments}&genders=${genders}&visitTypes=${visitTypes}&factor=${factor}&grouping_type=${grouping_type}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
};
const getLabData = async (date_from, date_to, departments, testTypes, factor, groupingType, token) => {
    const url = `${get_lab_agg_url}/?date_from=${date_from}&date_to=${date_to}&department_names=${departments}&type=${testTypes}&factor=${factor === 'department' ? 'DepartmentName' : 'Lab Record Name'}&grouping_type=${groupingType}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching lab data:', error);
    }
};
const getDischargeData = async (date_from, date_to, departments, dischargeTypes, factor, groupingType, token) => {
    const url = `${get_emergency_agg_url}/?date_from=${date_from}&date_to=${date_to}&department_names=${departments}&discharge_types=${dischargeTypes}&factor=${factor === 'department' ? 'DepartmentName' : 'Discharge_Status'}&grouping_type=${groupingType}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching discharge data:', error);
    }
};

const getBloodGroupData = async (date_from, date_to, departments, bloodGroups, factor, grouping_type, token) => {
    const url = `${get_resources_agg_url}/?date_from=${date_from}&date_to=${date_to}&department_names=${departments.join(',')}&factor=${factor === 'DepartmentName' ? 'DepartmentName' : 'Blood Group'}&grouping_type=${grouping_type}&blood-groups=${bloodGroups.join(',')}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching blood group data:', error);
        throw error; // Re-throw the error so it can be handled by the calling function
    }
};
// Function to get all department names
const getDeptList = async (token) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(get_dept_url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error in fetching department names:', error);
    }
};

// register user
const registerUser = async (formdata) => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await axios.post(signup_url, formdata, { headers });
    return response;

};
// login user
const loginUser = async (formdata) => {
    const headers = {
        'Content-Type': 'application/json'
    };
    const response = await axios.post(login_url, formdata, { headers });
    return response;

};


// verify otp
const verifyotp = async (otp, email) => {
    const headers = {
        'Content-Type': 'application/json'
    };
    console.log(otp, email);
    const response = await axios.post(opt_url,
        {
            email: email,
            otp: otp
        },
        {
            headers: headers
        });
    return response;

};
// resend otp
const resendOtp = async (email) => {
    const headers = {
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post(resend_opt_url,
            {
                email: email
            },
            {
                headers: headers
            });
        return response;
    } catch (error) {
        console.error('Error in resending otp:', error);
    }
};
//update user
const updateUser = async (token, data) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        console.log(data)
        const response = await axios.put(update_user_url, data, { headers });
        return response;
    } catch (error) {
        console.error('Error in update usersettings:', error);
    }
};
//update user theme
const updateUserTheme = async (token, theme) => {
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.put(update_usertheme_url, { theme }, { headers });
        return response;
    } catch (error) {
        console.error('Error in update usersettings:', error);
    }
};
//valid user 
const validUser = async (token) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    const response = await axios.get(validuser_url, { headers });
    return response;
};


// getting data for labs
const getdata_lab = async (date_from, date_to, department_names, grouping_type, token, type) => {
    const url = `${labdata_url}?date_from=${date_from}&date_to=${date_to}&department_names=${department_names}&grouping_type=${grouping_type}&type=${type}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
};
// getting data for resources
const getdata_resources = async (date_from, date_to, department_names, grouping_type, token) => {
    const url = `${resources_url}?date_from=${date_from}&date_to=${date_to}&department_names=${department_names}&grouping_type=${grouping_type}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
};
// getting data for emergency
const getdata_emergency = async (date_from, date_to, department_names, grouping_type, token,type) => {
    const url = `${emergency_url}?date_from=${date_from}&date_to=${date_to}&department_names=${department_names}&grouping_type=${grouping_type}&type=${type}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
};
// getting data for disease
const getdata_disease = async (date_from, date_to, department_names, grouping_type, token) => {
    const url = `${disease_url}?date_from=${date_from}&date_to=${date_to}&department_names=${department_names}&grouping_type=${grouping_type}`;

    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
};
const gettypes_test = async (token) => {
    const url = `${get_test_type_url}`;
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
}
const getDischargeType = async (token) => {
    const url = `${get_discharge_type_url}`;
    try {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error('Error in fetching data:', error);
    }
}

// request resetpass
const requestResetPassword = async (email) => {
    const url = `${request_pass_url}`;

    const headers = {
        'Content-Type': 'application/json'
    };
    const response = await axios.post(url, { "email": email }, { headers });
    // console.log(response)
    return response;
}
// request verify
const requestVerify = async (email, otp) => {
    const url = `${verify_request_url}`;

    const headers = {
        'Content-Type': 'application/json'
    };
    const response = await axios.post(url, { "email": email, "otp": otp }, { headers });
    return response;
}
// change pass
const changePassword = async (email, password) => {
    const url = `${changepass_url}`;

    const headers = {
        'Content-Type': 'application/json'
    };
    const response = await axios.post(url, { "email": email, "new_password": password }, { headers });
    return response;
}

const changeNewPassword = async (email, oldPassword, newPassword) => {
    const url = `${newPassword_url}`;

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(url, {
            email: email,
            old_password: oldPassword,
            new_password: newPassword
        }, { headers });

        return response.data;
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            throw new Error(error.response.data.message || 'Failed to change password');
        } else if (error.request) {
            // The request was made but no response was received
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw new Error('Error setting up the request');
        }
    }
};


 const updateDefaultValues = async (token, defaultValues) => {
    const url = `${update_default_values}`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
    try {
        console.log(url, defaultValues, { headers });
        const response = await axios.post(url, defaultValues, { headers });
        return response.data;
    } catch (error) {
        console.error('Error updating default values:', error);
        throw error;
    }
};

 const getDefaultValues = async (token) => {
    const url = `${get_default_values}`;
    const headers = {
        'Authorization': `Bearer ${token}`
    };
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error getting default values:', error);
        throw error;
    }
};
export { getDischargeData,getLabData,getBloodGroupData,updateDefaultValues,getDefaultValues,getMultiData,getDischargeType,changePassword, requestVerify, requestResetPassword, gettypes_test, getdata_disease, getdata_emergency, getdata_resources, getdata_home, getDeptList, registerUser, verifyotp, resendOtp, loginUser, updateUser, updateUserTheme, validUser, getdata_lab,changeNewPassword }
