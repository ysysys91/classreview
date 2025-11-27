import mongoose, { Schema, model, models } from 'mongoose'

const LectureSchema = new Schema({
  name: { type: String, required: true },
  professor: { type: String },
  description: { type: String },
})

const Lecture = models.Lecture || model('Lecture', LectureSchema)

export default Lecture
