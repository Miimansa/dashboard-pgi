import LoadingButton from '@mui/lab/LoadingButton';
import Styles from './Muibuttons.module.css'
const Loading_button = ({ name, loading, handleclick }) => {
    return (<>
        <LoadingButton
            className={Styles.loadingb}
            loading={loading}
            loadingPosition="mid"
            variant="contained"
            onClick={handleclick}
        >
            {!loading && name}
        </LoadingButton>
    </>);
}
export default Loading_button;