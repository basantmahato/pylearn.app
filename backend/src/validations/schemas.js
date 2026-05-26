const Joi = require('joi');

const categorySchema = Joi.string().valid('class11', 'class12', 'bca', 'btech', 'aiml');

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
    })
});

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
});

const quizSchema = Joi.object({
    chapterId: Joi.string().required(),
    setId: Joi.string().required(),
    setName: Joi.string().required(),
    difficulty: Joi.string().valid('Easy', 'Medium', 'Hard'),
    category: categorySchema.required(),
    questions: Joi.array().items(Joi.object({
        id: Joi.string(),
        question: Joi.string().required(),
        options: Joi.array().items(Joi.string()).length(4).required(),
        answer: Joi.number().min(0).max(3).required(),
        explanation: Joi.string().allow('')
    }))
});

module.exports = {
    chapterSchema,
    noteSchema,
    quizSchema
};
