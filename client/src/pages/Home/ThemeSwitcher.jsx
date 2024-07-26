import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setDarkTheme, setDefaultTheme, setLightTheme, setNatureTheme, setDarkTheme2, setLightTheme2, setTheme } from './themeUtils.js';
import Style from './MU_dropdown.module.css'
import { setgraph } from '../../state/graphSlice.js';
import { updateUserTheme } from '../Functions_Files/Fetchdata.js';
import { setuserTheme } from '../../state/userSlice.js';
import { message } from 'antd';
function ThemeSwitcher() {
  const userTheme = useSelector((state) => (state.user.user.theme))
  const token = useSelector((state) => (state.user.token));
  const dispatch = useDispatch();

  const changeTheme = async (theme) => {
    dispatch(setgraph(theme));
    let res;
    try {
      res = await updateUserTheme(token, theme);

      console.log(res.data.theme)
      dispatch(setuserTheme(res?.data.theme));
      message.success(res?.data.message);
    } catch (error) {
      message.error(res.data.message)
    }
  };

  return (
    <div className={Style.cont_th}>
      <div>Change Theme</div>
      <div className={Style.col_buttons}>
        <button onClick={() => changeTheme('default')} style={{ backgroundColor: '#f8b34b' }}></button>
        <button onClick={() => changeTheme('light')} style={{ backgroundColor: '#F5F5DC' }}></button>
        <button onClick={() => changeTheme('light 2')} style={{ backgroundColor: '#D6F8F7' }}></button>
        <button onClick={() => changeTheme('dark')} style={{ backgroundColor: '#000000' }}></button>
      </div>
    </div>
  );
}

export default ThemeSwitcher;