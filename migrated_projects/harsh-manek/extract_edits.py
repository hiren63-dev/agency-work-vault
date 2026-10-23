import json
import pickle

transcript_path = r'C:\Users\zediz\.gemini\antigravity\brain\dc0c739c-6797-4417-bb10-1da09af8d8ae\.system_generated\logs\transcript_full.jsonl'
edits = {}

with open(transcript_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'tool_calls' in data:
                for tc in data['tool_calls']:
                    if tc.get('name') == 'default_api:replace_file_content':
                        args = tc.get('args', {})
                        tc_target = args.get('TargetContent', '')
                        tc_repl = args.get('ReplacementContent', '')
                        
                        if 'function HeroPortrait' in tc_target:
                            edits['HeroPortrait'] = {'target': tc_target, 'repl': tc_repl}
                        elif 'function ExperienceSection' in tc_target:
                            edits['ExperienceSection'] = {'target': tc_target, 'repl': tc_repl}
                        elif 'function TeamSection' in tc_target:
                            edits['TeamSection'] = {'target': tc_target, 'repl': tc_repl}
                        elif 'function WhoYouAreFunnel' in tc_target:
                            edits['WhoYouAreFunnel'] = {'target': tc_target, 'repl': tc_repl}
        except Exception:
            pass

print(f'Found edits for: {list(edits.keys())}')

with open('edits.pkl', 'wb') as f:
    pickle.dump(edits, f)
