const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        const errorMessage = error.details.map((details) => details.message).join(', ');
        return res.status(400).json({ msg: errorMessage });
    }
    req.body = value;
    next();
};

module.exports = validate;
