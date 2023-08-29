import { DiscordLinePost,DiscordAdmin,SelectOption } from '../store';

export function MemberIdComprehension(
    userList:DiscordAdmin["guildMembers"]
){
    /*
    受け取ったサーバーメンバー一覧をSelectで選択できる形式に変換
    */
    let optionDict: SelectOption;
    let optionList: SelectOption[] = [];

    userList.forEach(user => {
        optionDict = {
            value:user.userId,
            label:user.userName
        }
        optionList.push(optionDict);
    });

    return optionList;
}

export function UserIdComprehension(
    userList:DiscordLinePost["users"]
){
    /*
    受け取ったサーバーメンバー一覧をSelectで選択できる形式に変換
    */
    let optionDict: SelectOption;
    let optionList: SelectOption[] = [];

    userList.forEach(user => {
        optionDict = {
            value:user.id,
            label:user.name
        }
        optionList.push(optionDict);
    });

    return optionList;
}

export function UserIdIndexComprehension(
    userIdList:string[],
    userList:DiscordAdmin["guildMembers"]
){
    /*
    受け取ったサーバーロール一覧をSelectで選択できる形式に変換
    */
    let optionDict: SelectOption;
    let optionList: SelectOption[] = [];

    userList.forEach(user => {
        if (userIdList.indexOf(user.userId) !== -1){
            optionDict = {
                value:user.userId,
                label:user.userName
            }
            optionList.push(optionDict);
        }
    });
    return optionList;
}

export function UserIdIndexOptionComprehension(
    userIdList:string[],
    userList:SelectOption[]
){
    /*
    受け取ったサーバーロール一覧をSelectで選択できる形式に変換
    */
    let optionList: SelectOption[] = [];

    userList.forEach(user => {
        if (userIdList.indexOf(user.value) !== -1){
            optionList.push(user);
        }
    });
    return optionList;
}

export function RoleIdComprehension(
    roleList:DiscordAdmin["guildRoles"]
){
    /*
    すでに選択されているサーバーメンバーを抜き取る
    */
    let optionDict: SelectOption;
    let optionList: SelectOption[] = [];

    roleList.forEach(role => {
        optionDict = {
            value:role.roleId,
            label:role.roleName
        }
        optionList.push(optionDict);
    });

    return optionList;
}

export function RoleIdIndexComprehension(
    roleIdList:string[],
    roleList:DiscordAdmin["guildRoles"]
){
    /*
    すでに選択されているロールを抜き取る
    */
    let optionDict: SelectOption;
    let optionList: SelectOption[] = [];

    roleList.forEach(role => {
        if (role.roleId in roleIdList){
            optionDict = {
                value:role.roleId,
                label:role.roleName
            }
            optionList.push(optionDict);
        }
    });

    return optionList;
}

export function RoleIdIndexOptionComprehension(
    roleIdList:string[],
    roleList:SelectOption[]
){
    /*
    受け取ったサーバーロール一覧をSelectで選択できる形式に変換
    */
    let optionList: SelectOption[] = [];

    roleList.forEach(role => {
        if (roleIdList.indexOf(role.value) !== -1){
            optionList.push(role);
        }
    });
    return optionList;
}