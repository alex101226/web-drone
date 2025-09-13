//  记载客服
export const useService = () => {

  const useCreateScript = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    //  https://o.alicdn.com/appflow/chatbot/v1/AppflowChatSDK.js
    script.src = 'https://o.alicdn.com/appflow/chatbot/v1/AppflowChatSDK.js';
    // script.src = 'https://gw.alipayobjects.com/render/p/yuyan_npm/@alipay_tbox-web-sdk/1.0.4/dist/index.umd.min.js';
    script.onload = () => {
      // const sdkInstance = new TBoxWebSDK.WebChatClient({
      //   config: {
      //     agentId: '202507AP575f00496410'
      //   }
      // })
      const sdkInstance = window.APPFLOW_CHAT_SDK.init({
        integrateConfig: 'cit-bbc511b032e14fb3a883',
        domain: {
          requestDomain: 'https://1072558463339856.appflow.aliyunnest.com',
        }
      })
      console.log('SDK 初始化成功', sdkInstance);
    }
    document.head.appendChild(script);
  }
  return { useCreateScript }
}