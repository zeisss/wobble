<?php

class TopicListService {
  public static function createAbstract($post_content, $text_length = 30) {
    $text = null;
    $headline = null;
    $offset = null;

    $headline = TopicListService::parseHeadline($post_content, $offset);
    $headline = strip_tags($headline);
    if (!is_null($offset)) {
      $text = substr(trim(strip_tags(substr(trim($post_content), $offset))), 0, $text_length);
    }

    return array(
      'headline' => $headline,
      'text' => $text
    );
  }
  
  private static function parseHeadline($post_content, &$offset) {
    if (empty($post_content)) {
      return "";
    }
    $post_content = trim($post_content);
    $offset = null;
    if ($post_content[0] !== '<') {
      # Text does not start with a tag, so we have to p
      $end = strpos($post_content, '<');
      if ($end === false) {
        return $post_content;
      } else {
        $offset = $end;
        return substr($post_content, 0, $end);
      }
    } else {
      $i = strpos($post_content, ' '); // Search the first whitespace
      $j = strpos($post_content, '>');

      if ($i === false) {
        if ($j === false) {
          return $post_content;
        }
        else {
          $tagNameEnd = $j;
        }
      } else {
        $tagNameEnd = $i < $j ? $i : $j;
      }
      
      $tag = substr($post_content, 1, $tagNameEnd - 1);
      $tagEnd = strpos($post_content, '>');
      if ($tagEnd === null) {
        # What? No idea Oo
        return $post_content;
      }

      $end = strpos($post_content, '</' . $tag . '>', $tagEnd);
      if ($end === null) {
        # Srsly?
        return $post_content;
      }

      $offset = $end + 3 + strlen($tag);
      return substr($post_content, $tagEnd + 1, $end - $tagEnd);
    }
  }
}