import React, { useState } from 'react';

interface FormData {
    name: string;
    emails: string[]; // 配列としてメールアドレスを保持
}

const InputForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        emails: [''], // 初期値として空の配列を設定
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        console.log(name, value,type);
        // 追加が押された場合
        if (name === 'emails' && type === 'add') {
            setFormData((prevData) => ({
                ...prevData,
                emails: [...prevData.emails, value], // 新しいメールアドレスを配列に追加
            }));
        // emailに入力された場合
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const jsonData = JSON.stringify(formData);
        console.log(jsonData);
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
            <div id='emailInput'>
                <button
                    type="button"
                    onClick={() => handleInputChange({ target: { name: 'emails', value: '', type:'add' } } as React.ChangeEvent<HTMLInputElement>)}
                >
                Add Email
                </button>
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
                        const newEmails = [...formData.emails];
                        newEmails.splice(index, 1);
                        setFormData((prevData) => ({
                            ...prevData,
                            emails: newEmails,
                        }));
                        }}
                    >
                        Remove Email
                    </button>
                </div>
            ))}
            <button type="submit">Submit</button>
        </form>
    );
};

export default InputForm;
