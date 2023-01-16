<?php

namespace App\Consts\Tables;

class LectureThreadConst extends ThreadsConst
{
    // 大枠カテゴリ名
    const PRIMARY_CATEGORY_NAME = ThreadPrimaryCategoryConst::LECTURE;

    // Eloquentモデルまでの完全修飾クラス名
    const MODEL_FQCN = '\App\Models\LectureThread';

    // テーブル名
    const NAME = 'lecture_threads';

    // 外部キーとして利用されるときのカラム名
    const USED_FOREIGN_KEY = 'lecture_thread_id';
}
