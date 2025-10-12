import requests

cookies = {
    'visitor_id': '5298a56c-93c5-11f0-85ac-f2cc0379a44d',
    'cf_clearance': 'CjoLJiviZAvvlXgdc_pns5TQ9bhX46EPV2QwOqpVhH4-1758116164-1.2.1.1-v.LiyiBT11JACxMa7y64D8HLj_cYuldbRD6SSUov0vHzLNeSzcwnoN0LAXq63pCRpIUQWrFTY79zxOJCCQmrzFLc6sS2bTJuPMcVzmHsEWzk2rGWelPOqPhiFZ_UwOVZPgeD_22H_GvBKZFnV6jaD9RGg4JUAYMLYVM6qsYtg0y.SkDg14354JEqmxGfZ1yHxvK2ZxSh2ZrOHnastxDxYrl2w28iC40xPdk6gMZAVj0',
}

headers = {
    'authority': 'zread.ai',
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'zh-CN,zh;q=0.9',
    'authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjdmNTk1ZDIzLThjOTEtNDI5OS05OTBjLWIxNTIxYzFiNzNhZSIsImVtYWlsIjoiMTgwMzI5MjYwMDJAMTM5LmNvbSJ9.kVtkARuq7N7P9JX8BuQJL_QlOCrpujXPDBp6vfFcCohd-o1OoEohN8ma4m8K-KuAhiI-_sbfpwKiRbQdA9B1kA',
    # 'cookie': 'visitor_id=5298a56c-93c5-11f0-85ac-f2cc0379a44d; cf_clearance=CjoLJiviZAvvlXgdc_pns5TQ9bhX46EPV2QwOqpVhH4-1758116164-1.2.1.1-v.LiyiBT11JACxMa7y64D8HLj_cYuldbRD6SSUov0vHzLNeSzcwnoN0LAXq63pCRpIUQWrFTY79zxOJCCQmrzFLc6sS2bTJuPMcVzmHsEWzk2rGWelPOqPhiFZ_UwOVZPgeD_22H_GvBKZFnV6jaD9RGg4JUAYMLYVM6qsYtg0y.SkDg14354JEqmxGfZ1yHxvK2ZxSh2ZrOHnastxDxYrl2w28iC40xPdk6gMZAVj0',
    'referer': 'https://zread.ai/',
    'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.95 Safari/537.36',
    'x-locale': 'zh',
}

response = requests.get('https://zread.ai/api/v1/repo/recommend', cookies=cookies, headers=headers)