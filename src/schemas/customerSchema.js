import joi from 'joi';

const customerSchema=joi.object({
    name:joi.string().required(),
    phone:joi.string().pattern(/[0-9]{10,11}/).required(),
    cpf:joi.string().pattern(/[0-9]{11}/).required(),
    birthday:joi.string().isoDate().required()
    //pattern(/[1-2]{1}[0-9]{3}-[0-1]{1}[0-2]{1}-[0-3]{1}[0-9]/)
});

export default customerSchema;