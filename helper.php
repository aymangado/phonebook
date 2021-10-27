<?php

function db_now($seconds = 0)
{
    return date("Y-m-d H:i:s", time() + $seconds);
}

function finish()
{
    exit(0);
}