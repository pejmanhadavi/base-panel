export default function (schema, options) {
  schema.add({
    code: {
      type: Number,
      default: 0,
    },
  });
  schema.statics.fun = function () {
    console.log(this);
  };
  schema.pre('save', function (next) {});
}
