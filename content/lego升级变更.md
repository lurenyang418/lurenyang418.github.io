+++
title = "lego升级变更(腾讯云)"
date = "2026-09-12 14:37:08+08:00"
[taxonomies]
tags = ["lego", "腾讯云"]
+++


lego 命令 [4->5](https://go-acme.github.io/lego/migration/cli/index.html)的一些变化
1. 接受参数的方式变了, 
2. 部署命令删除(renew)或者变更(list,revoke)
3. **另外删除了 `dnspod`. 需要调整为 [tencentcloud](https://go-acme.github.io/lego/dns/tencentcloud/index.html)**

    ```shell
    # 4
    lego --email="<email>" --dns dnspod --domains="<example.com>" --domains="*.example.com" run
    # 5
    lego run --email="<email>" --dns dnspod --domains="<example.com>" --domains="*.example.com" 
    ```