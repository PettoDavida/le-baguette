# TODO

- [ ] Search posts/subs (BROKEN)
- [x] follow user
- [x] delete posts as admin/self
- [x] User page
- [x] ban from group
- [x] delete comment as admin/self
- [ ] moderator permissions
- [x] display posts from followed subs
- [x] setup site hosting
- [x] favorite post

select \* from bannedusers left join posts on posts.id = '49d3b54e-2d71-4206-8254-b2637350f95c' where bannedusers.user_id = '3fa2fd34-b7f5-47d9-8408-5f2199e686e2' and posts.sub_id = bannedusers.sub_id
