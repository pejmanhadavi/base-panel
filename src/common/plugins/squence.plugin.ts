export default function (schema) {
  schema.add({
    code: {
      type: Number,
      unique: true,
      index: true,
    },
  });

  schema.pre('save', async function (next) {
    if (this.code) next();
    const Model = this.constructor;
    const lastObject = await Model.findOne({}, {}, { sort: { createdAt: -1 } });
    if (lastObject) this.code = lastObject.code + 1;
    else this.code = 1;
    next();
  });
}
