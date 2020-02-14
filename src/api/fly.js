let fly =require("flyio");
fly['config'] = {
    baseURL: JSON.parse(process.env.config.BASE_API),
    timeout: 1000*60
};
// 请求处理
fly['interceptors'].request.use((request) => {
    console.log('请求数据:',request.body)
    return request;
});
// 响应处理
fly['interceptors'].response.use(response => {
        console.log('响应数据',response.data);
        return response.data;
    }, error => {
       return error
    }
);
export default fly;