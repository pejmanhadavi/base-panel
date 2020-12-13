export default (status: string, result: number, data: Array<{}>) => {
  return {
    status,
    result,
    data,
  };
};
