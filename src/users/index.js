const getUsers = async (page) => {
  const messageBlock = await page.evaluate(() => document.querySelectorAll('.ForwardedMessageNew'))

  console.log(messageBlock)
  // for(const message of messageBlock) {
  //   const { user_id, user_name, date, avatar } = {
  //     user_id: message.querySelector('.ForwardedMessageNew__userName')?.href.slice(62) || "",
  //     user_name: message.querySelector('.ForwardedMessageNew__userName')?.textContent || "",
  //     date: message.querySelector('.im-mess-stack--tools')?.textContent || "",
  //     avatar: message.querySelector('img')?.src || ""
  //   };

  //   console.log({user_id, user_name, date, avatar})
  // }
}

module.exports = {
  getUsers
}
