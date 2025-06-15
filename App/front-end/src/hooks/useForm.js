import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export const useForm = (initialValues, onSubmit, isLogin) => {
    const [values, setValues] = useState(initialValues);

    const navigate = useNavigate();

    const changeHandler = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        onSubmit(values);

        if (!isLogin) {
            navigate('/')
        }
    };

    return { values, changeHandler, submitHandler };
};
