import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    boardName: Yup.string().min(2, 'Board must have at least 2 characters').max(20, 'Board must not have more than 20 characters').required('Board Name is required'),
    columnNames: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().min(2, 'Column name must have at least 2 characters').max(10, 'Column name must not have more than 10 characters')
        })
    ),
});

export default validationSchema;
