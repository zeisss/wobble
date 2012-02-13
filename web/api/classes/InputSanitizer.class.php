<?php

/**
 * Sanitizes user input, especially emails & post content
 */
class InputSanitizer {
    public static function sanitizeEmail($email) {
        return trim($email);    
    }
    
    /** 
     * Sanitizes user input by fixing the following things:
     * - Changes links to open in a new window (target="_new")
     */
    public static function sanitizePostContent($content) {
        do {
            $old_content = $content;
            $content = InputSanitizer::sanitizeLinks($old_content);
        } while ($content != $old_content);

        return $content;
    }
    
    public static function sanitizeLinks($content) {
        $i = strpos('<a', $content);
        if ($i === FALSE) {
            return $content;
        }
        
        $end = strpos('>', $i);
        if ($end === FALSE) {
            return $content;
        }
        
        $j = strpos('target')
        if ($j === FALSE) {
            # no target was found. Just replace the starting tag and be done.
            return substr($content, 0, $i) .
                   '<a target="_new" ' .
                   substr($content, $i + 2);
        }
        else {
            # Parsing html is hard. Actually too hard for this little project to do it right here.
            # The UI only provides a simple without a way to provide a link target. Thus we just
            # abort here.
            throw new Exception('Invalid content. Do not use target attribute in links(a): SAN-001');
        }
    }
}