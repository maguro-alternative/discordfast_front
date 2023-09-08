import React, { useState } from 'react';
import Select from "react-select";

interface FormData {
    name: string;
    emails: string[]; // 配列としてメールアドレスを保持
    testop: {
        value :string,
        label :string
    }[];
}

const InputForm: React.FC = () => {
    const options = [
        { value: "line", label: "折れ線グラフ" },
        { value: "bar", label: "棒グラフ" },
        { value: "pie", label: "円グラフ" },
    ];
    console.log(options);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        emails: [''], // 初期値として空の配列を設定
        testop: [{
            value:'',
            label:''
        }]
    });

    const [selectedValue, setSelectedValue] = useState([{ value: "line", label: "折れ線グラフ" }]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        console.log(name, value,type);
        // 追加が押された場合
        if (name === 'emails' && type === 'add') {
            setFormData((prevData) => ({
                ...prevData,
                emails: [...prevData.emails, value], // 新しいメールアドレスを配列に追加
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        formData.testop = selectedValue;
        const jsonData = JSON.stringify(formData);
        console.log(jsonData);
        console.log(selectedValue);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                />
            </div>
            {formData.emails.map((email, index) => (
                <div key={index}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="emails"
                        value={email}
                        onChange={(e) => {
                            const newEmails = [...formData.emails];
                            newEmails[index] = e.target.value;
                            setFormData((prevData) => ({
                                ...prevData,
                                emails: newEmails,
                            }));
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            if (index > 0){
                                const newEmails = [...formData.emails];
                                newEmails.splice(index, 1);
                                setFormData((prevData) => ({
                                    ...prevData,
                                    emails: newEmails,
                                }));
                            }
                        }}
                    >
                        Remove Email
                    </button>
                </div>
            ))}
            <div id='emailInput'>
                <button
                    type="button"
                    onClick={() => handleInputChange({
                        target: {
                            name: 'emails',
                            value: '',
                            type:'add'
                        }
                    } as React.ChangeEvent<HTMLInputElement>)}
                >
                Add Email
                </button>
            </div>
            <div style={{ width: "500px", margin: "50px" }}>
                <Select
                    options={options}
                    defaultValue={selectedValue}
                    onChange={(value) => {
                        value ? (
                            setSelectedValue([...value])
                        ) :(null);
                    }}
                    isMulti // trueに
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default InputForm;
