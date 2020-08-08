global.Headers = function (cfg) {
  this._cfg = cfg;
  this.has = (key) => key in this._cfg;
  this.get = (key) => this._cfg[key];
};

const {
  VALID_CODE,
  KEY_CODE,
  KEY_MSG,
  getErrorTip,
} = require("./busi.utils.ts");
jest.mock("@/store", () => ({
  getters: {
    GLOBAL_DATA: {
      // 各种统一提示，由 'GET /api/cps/getGlobalConfig' 返回
      tips: {
        // `jest.mock()` is not allowed to reference any out-of-scope variables
        "200": {
          // 成功时
          "/api/order/submitTempOrder": "操作成功1",
          "/api/cps/startInstance": "操作成功2",
          "/api/cps/stopInstance": "操作成功3",
          "/api/cps/restartInstance": "操作成功4",
          "/api/cps/reinstallInstance": "操作成功5",
          "/api/cps/modifyInstanceName": "操作成功6",
          "/api/cps/modifyInstanceDescription": "操作成功7",
          "/api/cps/associateElasticIp": "操作成功8",
          "PUT /api/cps/disassociateElasticIp": "操作成功9",
          "PUT /api/cps/disassociateElasticIp/:param1": "操作成功19",
          "/api/cps/disassociateElasticIp": "操作成功911",
        },
        "40201": {
          default: "HELLO WORLD",
          "/api/ticket/importToOssByName": "附件上传失败1",
          "/api/ticket/submitTicket": "提交工单失败298",
          "DELETE /api/ticket/submitTicket": "提交工单失败2",
          "DELETE /ports/:portId/xxx/:param2": "删除失败",
        },
        "40879": {
          "/api/ticket/cancelTicket": "工单操作失败1",
          "/api/ticket/confirmPlan": "工单操作失败2",
          "/api/ticket/confirmDeliver": "工单操作失败3",
        },
      },
    },
  },
}));

describe("测试全局提示", () => {
  it("简单 URL 匹配", () => {
    expect(
      getErrorTip(
        "GET /api/cps/reinstallInstance",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("操作成功5");

    expect(
      getErrorTip(
        "DELETE /api/ticket/confirmPlan",
        {
          [KEY_CODE]: 40879,
          [KEY_MSG]: "yyy",
        },
        null
      )
    ).toEqual("工单操作失败2");
  });

  it("默认 URL 匹配", () => {
    expect(
      getErrorTip(
        "GET /api/cps/undefined1",
        {
          [KEY_CODE]: 40201,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("HELLO WORLD");

    expect(
      getErrorTip(
        "GET /api/cps/undefined2",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toBeFalsy();

    expect(
      getErrorTip(
        "GET /api/cps/undefined3",
        {
          [KEY_CODE]: 40879,
          [KEY_MSG]: "xxx123",
        },
        null
      )
    ).toEqual("xxx123");
  });

  it("带 method 的 URL 匹配", () => {
    expect(
      getErrorTip(
        "PUT /api/cps/disassociateElasticIp",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("操作成功9");
    expect(
      getErrorTip(
        "DELETE /api/ticket/submitTicket/",
        {
          [KEY_CODE]: 40201,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("提交工单失败2");
  });

  it("完整的 URL 匹配", () => {
    expect(
      getErrorTip(
        "PUT https://foo.com/bar/api/cps/modifyInstanceName",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("操作成功6");
    expect(
      getErrorTip(
        "DELETE ws://foo.com/api/ticket/confirmPlan/#abc=123&cba=321?foo=bar&iii=777",
        {
          [KEY_CODE]: 40879,
          [KEY_MSG]: "yyy",
        },
        null
      )
    ).toEqual("工单操作失败2");
    expect(
      getErrorTip(
        "DELETE http://local.console.jdcloud.com:8080/apis/api/ticket/submitTicket?vpcId=2e4a4153-9636-4355-8386-d903e443d151",
        {
          [KEY_CODE]: 40201,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("提交工单失败2");
  });

  it("带参数的 route 匹配", () => {
    expect(
      getErrorTip(
        "PUT /api/cps/disassociateElasticIp/023ffsfsf02342f",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("操作成功19");
    expect(
      getErrorTip(
        "DELETE https://foo.com/bar/ports/9923fsffff/xxx/8823f23f",
        {
          [KEY_CODE]: 40201,
          [KEY_MSG]: "xxx",
        },
        null
      )
    ).toEqual("删除失败");
  });

  it("无 URL 匹配", () => {
    expect(
      getErrorTip(
        "PUT /api/cps/abc",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxxyyy",
        },
        null
      )
    ).toBeFalsy();

    expect(
      getErrorTip(
        "PUT /api/cps/abc",
        {
          [KEY_CODE]: 43456,
          [KEY_MSG]: "xxxyyy",
        },
        null
      )
    ).toEqual("xxxyyy");
  });

  it("从 header 中注明直接提示", () => {
    expect(
      getErrorTip(
        "GET /api/order/submitTempOrder",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        new Headers({
          "no-global-config-warn": "store",
        })
      )
    ).toEqual("xxx");
    expect(
      getErrorTip(
        "DELETE /api/ticket/submitTicket",
        {
          [KEY_CODE]: 40879,
          [KEY_MSG]: "yyy",
        },
        new Headers({
          "no-global-config-warn": "store",
        })
      )
    ).toEqual("yyy");
  });

  it("header 中注明了不提示", () => {
    expect(
      getErrorTip(
        "PUT /api/cps/reinstallInstance",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        new Headers({
          "no-global-config-warn": 1,
        })
      )
    ).toBeFalsy();
    expect(
      getErrorTip(
        "PUT /api/cps/reinstallInstance",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        new Headers({
          "no-global-config-warn": "success", // 只在成功时不提示
        })
      )
    ).toBeFalsy();
    expect(
      getErrorTip(
        "PUT /api/cps/reinstallInstance",
        {
          [KEY_CODE]: 41345,
          [KEY_MSG]: "x321",
        },
        new Headers({
          "no-global-config-warn": "success", // 只在成功时不提示
        })
      )
    ).toEqual("x321");
    expect(
      getErrorTip(
        "PUT /api/cps/foobar",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "x987",
        },
        new Headers({
          "no-global-config-warn": "error", // 只在错误时不提示
        })
      )
    ).toBeFalsy(); // 成功时，除非特别在 globalData 中指定，否则也不会提示 message
    expect(
      getErrorTip(
        "PUT /api/cps/foobar",
        {
          [KEY_CODE]: VALID_CODE,
          [KEY_MSG]: "xxx",
        },
        new Headers({
          "no-global-config-warn": "error", // 只在错误时不提示
        })
      )
    ).toBeFalsy();
  });
});
