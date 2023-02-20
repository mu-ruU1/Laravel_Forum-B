<?php

namespace App\Consts\Tables;

class ContactAdministratorConst
{
    // テーブル名
    const NAME = 'contact_administrators';

    // 外部キーとして利用されるときのカラム名
    const USED_FOREIGN_KEY = 'contact_administrator_id';

    // カラム名
    const ID = 'id';
    const USER_ID = UserConst::USED_FOREIGN_KEY;
    const TYPE = 'type';
    const MESSAGE = 'message';
    const CREATED_AT = 'created_at';
    const UPDATED_AT = 'updated_at';

    // カラム一覧
    const COLUMNS = [
        self::ID,
        self::USER_ID,
        self::TYPE,
        self::MESSAGE,
        self::CREATED_AT,
        self::UPDATED_AT,
    ];
}
