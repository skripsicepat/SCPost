CREATE OR REPLACE FUNCTION decrement_revision_count(chapter_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
  new_count INTEGER;
BEGIN
  SELECT revision_count INTO current_count
  FROM public.chapters
  WHERE id = chapter_id_param;
  
  IF current_count IS NULL THEN
    RAISE EXCEPTION 'Chapter not found';
  END IF;
  
  IF current_count <= 0 THEN
    RAISE EXCEPTION 'No revisions remaining for this chapter';
  END IF;
  
  new_count := current_count - 1;
  
  UPDATE public.chapters
  SET revision_count = new_count,
      updated_at = NOW()
  WHERE id = chapter_id_param;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_revisions_to_chapter(
  chapter_id_param UUID,
  revisions_to_add INTEGER DEFAULT 5
)
RETURNS INTEGER AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.chapters
  SET revision_count = revision_count + revisions_to_add,
      updated_at = NOW()
  WHERE id = chapter_id_param
  RETURNING revision_count INTO new_count;
  
  IF new_count IS NULL THEN
    RAISE EXCEPTION 'Chapter not found';
  END IF;
  
  RETURN new_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION record_revision(
  chapter_id_param UUID,
  feedback_param TEXT,
  previous_content_param TEXT,
  new_content_param TEXT
)
RETURNS UUID AS $$
DECLARE
  revision_id UUID;
  remaining_count INTEGER;
BEGIN
  remaining_count := decrement_revision_count(chapter_id_param);
  
  INSERT INTO public.revision_history (
    chapter_id,
    feedback,
    previous_content,
    new_content
  )
  VALUES (
    chapter_id_param,
    feedback_param,
    previous_content_param,
    new_content_param
  )
  RETURNING id INTO revision_id;
  
  RETURN revision_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_chapter_revision_count(chapter_id_param UUID)
RETURNS INTEGER AS $$
DECLARE
  count_value INTEGER;
BEGIN
  SELECT revision_count INTO count_value
  FROM public.chapters
  WHERE id = chapter_id_param;
  
  RETURN COALESCE(count_value, 0);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION initialize_chapters_for_thesis(thesis_id_param UUID)
RETURNS void AS $$
DECLARE
  chapter_types TEXT[] := ARRAY['bab-1', 'bab-2', 'bab-3', 'bab-4', 'bab-5', 'daftar-pustaka'];
  chapter_type TEXT;
BEGIN
  FOREACH chapter_type IN ARRAY chapter_types
  LOOP
    INSERT INTO public.chapters (thesis_id, chapter_type, revision_count, is_complete)
    VALUES (thesis_id_param, chapter_type, 5, FALSE);
  END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE INDEX IF NOT EXISTS idx_revision_history_chapter_id ON public.revision_history(chapter_id);
CREATE INDEX IF NOT EXISTS idx_revision_purchases_chapter_id ON public.revision_purchases(chapter_id);
