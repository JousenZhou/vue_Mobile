const store = new class {
    data = {
        count: 1
    };
    sub = () => {
        this.data.count--
    };
    add = () => {
        this.data.count++
    }
};
export default store;