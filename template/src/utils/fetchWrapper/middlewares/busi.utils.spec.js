const { getErrorTip } = require('./busi.utils');

global.Headers = function(cfg) {
  this._cfg = cfg;
  this.has = key => key in this._cfg;
  this.get = key => this._cfg[key];
};

jest.mock('@/store', () => ({
  getters: {
    GLOBAL_DATA: {
      // 各种统一提示，由 'GET /ajax-api/foo/getGlobalConfig' 返回
      tips: {
        '20000': { // 成功时
          '/ajax-api/order/submitTempOrder': '操作成功1',
          '/ajax-api/foo/start': '操作成功2',
          '/ajax-api/foo/stop': '操作成功3',
          '/ajax-api/foo/restart': '操作成功4',
          '/ajax-api/foo/reinstall': '操作成功5',
          '/ajax-api/foo/modifyName': '操作成功6',
          '/ajax-api/foo/modifyDescription': '操作成功7',
          '/ajax-api/foo/associate': '操作成功8',
          'PUT /ajax-api/foo/disassociate': '操作成功9',
          'PUT /ajax-api/foo/disassociate/:param1': '操作成功19',
          '/ajax-api/foo/disassociate': '操作成功911',
        },
        '40201': {
          'default': 'HELLO WORLD',
          '/ajax-api/ticket/importToOssByName': '附件上传失败1',
          '/ajax-api/ticket/submitTicket': '提交失败298',
          'DELETE /ajax-api/ticket/submitTicket': '提交失败2',
          'DELETE /ports/:portId/xxx/:param2': '删除失败',
        },
        '40879': {
          '/ajax-api/ticket/cancelTicket': '操作失败1',
          '/ajax-api/ticket/confirmPlan': '操作失败2',
          '/ajax-api/ticket/confirmDeliver': '操作失败3'
        }
      }
    }
  }
}));

describe('测试全局提示', () => {
  it('简单 URL 匹配', () => {
    expect(getErrorTip(
      'GET /ajax-api/foo/reinstall',
      {
        code: 20000,
        message: 'xxx'
      },
      null
    )).toEqual('操作成功5');

    expect(getErrorTip(
      'DELETE /ajax-api/ticket/confirmPlan',
      {
        code: 40879,
        message: 'yyy'
      },
      null
    )).toEqual('操作失败2');
  });

  it('默认 URL 匹配', () => {
    expect(getErrorTip(
      'GET /ajax-api/foo/undefined1',
      {
        code: 40201,
        message: 'xxx'
      },
      null
    )).toEqual('HELLO WORLD');

    expect(getErrorTip(
      'GET /ajax-api/foo/undefined2',
      {
        code: 20000,
        message: 'xxx'
      },
      null
    )).toBeFalsy();

    expect(getErrorTip(
      'GET /ajax-api/foo/undefined3',
      {
        code: 40879,
        message: 'xxx123'
      },
      null
    )).toEqual('xxx123');
  });

  it('带 method 的 URL 匹配', () => {
    expect(getErrorTip(
      'PUT /ajax-api/foo/disassociate',
      {
        code: 20000,
        message: 'xxx'
      },
      null
    )).toEqual('操作成功9');
    expect(getErrorTip(
      'DELETE /ajax-api/ticket/submitTicket/',
      {
        code: 40201,
        message: 'xxx'
      },
      null
    )).toEqual('提交失败2');
  });

  it('完整的 URL 匹配', () => {
    expect(getErrorTip(
      'PUT https://foo.com/bar/ajax-api/foo/modifyName',
      {
        code: 20000,
        message: 'xxx'
      },
      null
    )).toEqual('操作成功6');
    expect(getErrorTip(
      'DELETE ws://foo.com/ajax-api/ticket/confirmPlan/#abc=123&cba=321?foo=bar&iii=777',
      {
        code: 40879,
        message: 'yyy'
      },
      null
    )).toEqual('操作失败2');
    expect(getErrorTip(
      'DELETE http://local.foo.com:8080/ajax-api/ticket/submitTicket?vpcId=2e4a4153d903e443d151',
      {
        code: 40201,
        message: 'xxx'
      },
      null
    )).toEqual('提交失败2');
  });

  it('带参数的 route 匹配', () => {
    expect(getErrorTip(
      'PUT /ajax-api/foo/disassociate/023ffsfsf02342f',
      {
        code: 20000,
        message: 'xxx'
      },
      null
    )).toEqual('操作成功19');
    expect(getErrorTip(
      'DELETE https://foo.com/bar/ports/9923fsffff/xxx/8823f23f',
      {
        code: 40201,
        message: 'xxx'
      },
      null
    )).toEqual('删除失败');
  });

  it('无 URL 匹配', () => {
    expect(getErrorTip(
      'PUT /ajax-api/foo/abc',
      {
        code: 20000,
        message: 'xxxyyy'
      },
      null
    )).toBeFalsy();

    expect(getErrorTip(
      'PUT /ajax-api/foo/abc',
      {
        code: 43456,
        message: 'xxxyyy'
      },
      null
    )).toEqual('xxxyyy');
  });

  it('header 中注明了不提示', () => {
    expect(getErrorTip(
      'PUT /ajax-api/foo/reinstall',
      {
        code: 20000,
        message: 'xxx'
      },
      new Headers({
        'no-global-config-warn': 1
      })
    )).toBeFalsy();
    expect(getErrorTip(
      'PUT /ajax-api/foo/reinstall',
      {
        code: 20000,
        message: 'xxx'
      },
      new Headers({
        'no-global-config-warn': 'success' // 只在成功时不提示
      })
    )).toBeFalsy();
    expect(getErrorTip(
      'PUT /ajax-api/foo/reinstall',
      {
        code: 41345,
        message: 'x321'
      },
      new Headers({
        'no-global-config-warn': 'success' // 只在成功时不提示
      })
    )).toEqual('x321');
    expect(getErrorTip(
      'PUT /ajax-api/foo/foobar',
      {
        code: 20000,
        message: 'x987'
      },
      new Headers({
        'no-global-config-warn': 'error' // 只在错误时不提示
      })
    )).toBeFalsy(); // 成功时，除非特别在 globalData 中指定，否则也不会提示 message
    expect(getErrorTip(
      'PUT /ajax-api/foo/foobar',
      {
        code: 20000,
        message: 'xxx'
      },
      new Headers({
        'no-global-config-warn': 'error' // 只在错误时不提示
      })
    )).toBeFalsy();
  });
});
