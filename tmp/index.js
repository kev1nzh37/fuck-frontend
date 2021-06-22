var longestPalindrome = function(s) {
  if (s.length < 2) {
    return s;
  }
  let res = '';
  for (let i = 0; i < s.length; i++) {
    // 回文子串长度是奇数
    helper(i, i, 'function1');
    // 回文子串长度是偶数
    helper(i, i + 1, 'function2');
  }

  function helper(m, n, type) {
    console.log('是哪个函数：', type);
    console.log('m: ', m);
    console.log('n: ', n);
    console.log('s[m]: ', s[m]);
    console.log('s[n]: ', s[n]);
    console.log('            ');
    // m不是第一个， n没走完字符串，
    while (m >= 0 && n < s.length && s[m] == s[n]) {
      console.log('循环中的mn');
      console.log('m:  ', m, ' s[m]: ', s[m]);
      console.log('n:  ', n, ' s[n]: ', s[n]);
      m--;
      n++;
    }
    console.log('while之后的mn值');
    console.log('m: ', m);
    console.log('n: ', n);
    console.log('s[m]: ', s[m]);
    console.log('s[n]: ', s[n]);
    console.log('            ');
    // 注意此处m,n的值循环完后  是恰好不满足循环条件的时刻
    // 此时m到n的距离为n-m+1，但是mn两个边界不能取 所以应该取m+1到n-1的区间  长度是n-m-1
    if (n - m - 1 > res.length) {
      console.log('判断里的nm：');
      console.log('m: ', m);
      console.log('n: ', n);
      console.log('res.length：', res.length);
      console.log('str:  ', s.slice(m + 1, n));
      console.log('--------------');
      // slice也要取[m+1,n-1]这个区间
      res = s.slice(m + 1, n);
    }
  }
  return res;
};

const a = longestPalindrome('abcacdc');
console.log(a);
