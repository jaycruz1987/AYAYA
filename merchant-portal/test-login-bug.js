const handleSubmit = (onValid) => (e) => {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
  onValid();
}
const onFinish = handleSubmit(() => console.log('Valid!'));
onFinish({ email: "test" });
