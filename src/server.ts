import ExpressApp from "./app";

const app = new ExpressApp();

app.start().listen(3001, () => {
  console.log(`Server running on port ${3001}`);
});
