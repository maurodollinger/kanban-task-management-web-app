import { FieldInputProps, FieldMetaProps } from "formik";

export const MyInput = ({ field, ...props }: { field: FieldMetaProps<string>, props: FieldInputProps<string> }) => {
    return <input {...field} {...props} />;
};