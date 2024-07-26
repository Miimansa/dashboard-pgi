import * as React from 'react';
import { Menu } from '@mui/base/Menu';
import { MenuItem, menuItemClasses } from '@mui/base/MenuItem';
import { MenuButton } from '@mui/base/MenuButton';
import { Dropdown } from '@mui/base/Dropdown';
import { useTheme } from '@mui/system';
import Logout from "./Logout";
import { Link } from 'react-router-dom';
import St from './MU_dropdown.module.css'
import ThemeSwitcher from './ThemeSwitcher.jsx';
import { useSelector } from 'react-redux';
export default function MenuSimple() {
    const profileLink = {
        width: '100%',
        textDecoration: 'none',
        color: '#000',
    };
    let Name = useSelector(state => state.user.user.full_name) || 'USER';
    Name = Name.toUpperCase();
    const icon = () => {
        return (
            <div className={St.profileDivStyle}>
                {Name[0]}
            </div>
        );
    };

    return (
        <Dropdown>
            <MenuButton className="TriggerButtonSimple">
                {icon()}
            </MenuButton>
            <Menu
                className="CustomMenuSimple"
                slotProps={{
                    listbox: { className: 'CustomMenuSimple--listbox' },
                }}
            >
                <MenuItem className="CustomMenuSimple--item">

                    <Link style={profileLink} to='/profile'>
                        <div>My Profile</div>
                    </Link>

                </MenuItem>
                <MenuItem className="CustomMenuSimple--item">
                    <ThemeSwitcher />
                </MenuItem>
                <MenuItem className="CustomMenuSimple--item">
                    <div ><Logout /></div>
                </MenuItem>
            </Menu>
            <Styles />
        </Dropdown>
    );
}
const cyan = {
    50: '#E9F8FC',
    100: '#BDEBF4',
    200: '#99D8E5',
    300: '#66BACC',
    400: '#1F94AD',
    500: '#0D5463',
    600: '#094855',
    700: '#063C47',
    800: '#043039',
    900: '#022127',
};

const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

function useIsDarkMode() {
    const theme = useTheme();
    return theme.palette.mode === 'dark';
}

function Styles() {
    // Replace this with your app logic for determining dark mode
    const isDarkMode = useIsDarkMode();

    return (
        <style>{`
    .CustomMenuSimple--item:hover {
      cursor: pointer;
    }
    .CustomMenuSimple--listbox {
      font-family: 'IBM Plex Sans', sans-serif;
      font-size: 0.875rem;
      box-sizing: border-box;
      padding: 6px;
      margin: 12px 0;
      min-width: 200px;
      border-radius: 12px;
      overflow: auto;
      outline: 0px;
      background: ${isDarkMode ? grey[900] : '#fff'};
      border: 1px solid ${isDarkMode ? grey[700] : grey[200]};
      color: ${isDarkMode ? grey[300] : grey[900]};
      box-shadow: 0px 4px 6px ${isDarkMode ? 'rgba(0,0,0, 0.50)' : 'rgba(0,0,0, 0.05)'
            };
    } 
    .CustomMenuSimple--item {
      list-style: none;
      padding: 8px;
      border-radius: 8px;
      cursor: default;
      user-select: none;
    }

    .CustomMenuSimple--item:last-of-type {
      border-bottom: none;
    }

    .CustomMenuSimple--item:focus {
      outline: 3px solid ${isDarkMode ? cyan[600] : cyan[200]};
      background-color: ${isDarkMode ? grey[800] : grey[100]};
      color: ${isDarkMode ? grey[300] : grey[900]};
    }

    .CustomMenuSimple--item.${menuItemClasses.disabled} {
      color: ${isDarkMode ? grey[700] : grey[400]};
    }

    .TriggerButtonSimple {
      background-color: transparent;
      border: none;
      padding:4px;
    }
    .TriggerButtonSimple:hover {
      cursor: pointer;
    }

    .CustomMenuSimple {
      z-index: 1;
    }
    `}</style>
    );
}