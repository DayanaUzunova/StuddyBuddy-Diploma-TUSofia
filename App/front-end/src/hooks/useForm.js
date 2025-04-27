import { useState } from "react";

export const useForm = (initialValues, onSubmit) => {
    const [values, setValues] = useState(initialValues);

    const changeHandler = (event) => {
        setValues({ ...values, [event.target.name]: event.target.value });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        onSubmit(values);
    };

    return { values, changeHandler, submitHandler };
};
