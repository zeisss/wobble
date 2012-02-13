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
        $content = InputSanitizer::sanitizeLinks($content);

        return $content;
    }
    
    public static function sanitizeLinks($content) {
        $offset = 0;
        
        while (true) {
            $i = strpos($content, '<a', $offset);
            if ($i === FALSE) {
                return $content;
            }    
            
            $end = strpos($content, '>', $i);
            if ($end === FALSE) {
                return $content;
            }
            
            $j = strpos($content, 'target', $i);
            if ($j === FALSE) {
                # no target was found. Just replace the starting tag and be done.
                $content = substr($content, 0, $i) .
                           '<a target="_new"' .
                           substr($content, $i + 2);
                $offset = $i + 16;
            }
            else {
                # Parsing html is hard. Actually too hard for this little project to do it right here.
                # The UI only provides a simple without a way to provide a link target. Thus we just
                # abort here.
                throw new Exception('Invalid content. Do not use target attribute in links(a): SAN-001');
            }
        }
    }
}

print (InputSanitizer::sanitizePostContent('<a href="http://ec2-46-51-143-163.eu-west-1.compute.amazonaws.com/dev/#7-1328992318043">http://ec2-46-51-143-163.eu-west-1.compute.amazonaws.com/dev/#7-1328992318043</a>'));