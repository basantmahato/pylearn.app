const Joi = require('joi');

const categorySchema = Joi.string();

const chapterSchema = Joi.object({
    chapterId: Joi.string().required(),
    title: Joi.string().required(),
    order: Joi.number().required(),
    category: categorySchema.required(),
    summary: Joi.object({
        short_summary: Joi.string().allow(''),
        detailed_summary: Joi.string().allow(''),
        exam_focus: Joi.array().items(Joi.string()),
        revision_notes: Joi.array().items(Joi.string())
    }).unknown(true),
    practice: Joi.array().items(Joi.object({
        id: Joi.string().optional(),
        _id: Joi.string().optional(),
        q: Joi.string().required(),
        type: Joi.string().valid('theory', 'coding', 'Theory', 'Coding').required(),
        difficulty: Joi.string().valid('easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard').required(),
        hints: Joi.array().items(Joi.string()),
        solution: Joi.object({
            explanation: Joi.string().allow(''),
            code: Joi.string().allow(''),
            example: Joi.string().allow('')
        }).unknown(true)
    }).unknown(true))
}).unknown(true);

const noteSchema = Joi.object({
    chapterId: Joi.string().required(),
    category: categorySchema.required(),
    type: Joi.string().valid('paragraph', 'bullet_list', 'code').required(),
    heading: Joi.string().allow(''),
    text: Joi.string().allow(''),
    items: Joi.array().items(Joi.string()),
    code: Joi.string().allow(''),
    language: Joi.string().allow(''),
    order: Joi.number()
}).unknown(true);

const quizSchema = Joi.object({
    chapterId: Joi.string().required(),
    setId: Joi.string().required(),
    setName: Joi.string().required(),
    difficulty: Joi.string().valid('easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard'),
    category: categorySchema.required(),
    questions: Joi.array().items(Joi.object({
        id: Joi.string().optional(),
        _id: Joi.string().optional(),
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).length(4).required(),
        answer: Joi.number().min(0).max(3).required(),
        explanation: Joi.string().allow('')
    }).unknown(true))
}).unknown(true);

module.exports = {
    chapterSchema,
    noteSchema,
    quizSchema
};
