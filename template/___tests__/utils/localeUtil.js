import { formatLocale } from "@/utils/localeUtil.js";

describe("test localeUtil", ()=>{
  it("should match particular format", ()=>{
    expect( formatLocale("cn") ).toEqual('zh-CN');
  });
  it("should match valid format", ()=>{
    expect( formatLocale("chi") ).toEqual('chi');
    expect( formatLocale("zh-MO") ).toEqual('zh-MO');
    expect( formatLocale("zh-Hant-TW") ).toEqual('zh-Hant-TW');
    expect( formatLocale("en-UK") ).toEqual('en-UK');
    expect( formatLocale("jp-JP") ).toEqual('jp-JP');
    expect( formatLocale("jp") ).toEqual('jp');
  });
  it("should not match invalid format", ()=>{
    expect( formatLocale("china") ).toEqual('en-US');
    expect( formatLocale("zh_CN") ).toEqual('en-US');
    expect( formatLocale("zhCN") ).toEqual('en-US');
  });
});