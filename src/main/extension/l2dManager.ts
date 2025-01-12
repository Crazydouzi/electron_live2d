const basePath:string=process.cwd()

export default{
  getModelPath(){
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
      return MAIN_WINDOW_VITE_DEV_SERVER_URL+"/model"
    } else {
      return basePath+"/resources/model"
    }
  }

}
