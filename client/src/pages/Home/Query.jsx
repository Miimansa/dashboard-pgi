import React, { useState } from "react";
import Styles from './Query.module.css';
import { Modal } from '@material-ui/core';

const Query = () => {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [selectedItem, setSelectedItem] = useState(null); // State to track which item is selected

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleSubmit = () => {
        if (inputValue.trim()) {
            setData([...data, inputValue]);
            setInputValue("");
        }
    };

    const handleItemClick = (index) => {
        setSelectedItem(index); // Set the selected item index when clicked
    };

    const handleCloseModal = () => {
        setSelectedItem(null); // Reset selected item to close modal
    };

    return (
        <>
            <div className={`${Styles.contq} ${data.length && Styles.contq_after}`}>
                <textarea
                    className={Styles.area}
                    type="text"
                    placeholder="Enter Your query here..."
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <div className={` ${data.length && Styles.items}`}>
                {data.map((item, index) => (
                    <p
                        className={Styles.content}
                        key={index}
                        onClick={() => handleItemClick(index)} // Handle click on paragraph
                    >
                        <strong> {index + 1}.</strong> {item}
                    </p>
                ))}
            </div>
            <Modal open={selectedItem !== null} onClose={handleCloseModal}>
                <div className={Styles.modalContent}>
                    {selectedItem !== null && (
                        <p className={Styles.selectedItemContent}>
                            <strong>{selectedItem + 1}.</strong> {data[selectedItem]}
                        </p>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Query;
