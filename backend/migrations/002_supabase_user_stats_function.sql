-- Supabase Migration: User Stats Function
-- This creates a database function to efficiently query user stats
-- Can be used as an alternative to application-level aggregation

CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_user RECORD;
  v_stats JSON;
BEGIN
  -- Get user basic info
  SELECT 
    id,
    name,
    email,
    avatar,
    points,
    xp,
    level,
    trust_score,
    badges
  INTO v_user
  FROM users
  WHERE id = p_user_id;

  -- Return null if user not found
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  -- Build stats JSON
  SELECT json_build_object(
    'userId', v_user.id,
    'name', v_user.name,
    'email', v_user.email,
    'avatar', v_user.avatar,
    'points', v_user.points,
    'xp', v_user.xp,
    'level', v_user.level,
    'trustScore', v_user.trust_score,
    'badges', v_user.badges,
    'stats', json_build_object(
      'createdPins', (
        SELECT COUNT(*)::INTEGER
        FROM pins
        WHERE user_id = p_user_id
      ),
      'verifiedPins', (
        SELECT COUNT(*)::INTEGER
        FROM verifications
        WHERE user_id = p_user_id
      ),
      'submittedReports', (
        SELECT COUNT(*)::INTEGER
        FROM confirmations
        WHERE user_id = p_user_id
        AND report_type = 'official-report'
      ),
      'resolvedPins', (
        SELECT COUNT(*)::INTEGER
        FROM pins
        WHERE user_id = p_user_id
        AND status = 'resolved'
      )
    ),
    'recentActivity', json_build_object(
      'lastPinCreated', (
        SELECT MAX(created_at)::TEXT
        FROM pins
        WHERE user_id = p_user_id
      ),
      'lastVerification', (
        SELECT MAX(created_at)::TEXT
        FROM verifications
        WHERE user_id = p_user_id
      ),
      'lastReportSubmitted', (
        SELECT MAX(created_at)::TEXT
        FROM confirmations
        WHERE user_id = p_user_id
        AND report_type = 'official-report'
      )
    )
  ) INTO v_stats;

  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_stats(UUID) TO anon;

-- Add comment
COMMENT ON FUNCTION get_user_stats(UUID) IS 'Returns comprehensive user statistics including pins, verifications, reports, and recent activity';

