import * as Yup from 'yup';
/*
const isBoardNameUnique = (existingBoards: string[]) => {
    return Yup.string().test({
        name: 'unique',
        message: 'Board name must be unique',
        test: function (value) {
            return value ? !existingBoards.includes(value) : true;
        },
    });
};*/

export const createValidationSchema = (existingBoards: string[]) => {
    return Yup.object().shape({
        boardName: Yup.string().min(2, 'Board must have at least 2 characters')
            .max(20, 'Board must not have more than 20 characters').required('Board Name is required')
            .test({
                name: 'unique',
                message: 'Board name must be unique',
                exclusive: true,
                params: { existingBoards },
                test: (value) => !existingBoards.includes(value)
            }),
        columnNames: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().min(2, 'Column name must have at least 2 characters')
                    .max(10, 'Column name must not have more than 10 characters')
            })
        ),
    });
};


const validationSchema = Yup.object().shape({
    boardName: Yup.string().min(2, 'Board must have at least 2 characters')
        .max(20, 'Board must not have more than 20 characters').required('Board Name is required'),
    columnNames: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().min(2, 'Column name must have at least 2 characters')
                .max(10, 'Column name must not have more than 10 characters')
        })
    ),
});

export default validationSchema;
