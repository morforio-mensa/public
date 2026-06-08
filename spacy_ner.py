import sys
import json
import spacy

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"brands": []}))
        return
        
    # Read text from command line argument
    text = sys.argv[1]
    
    try:
        # Load the Portuguese pre-trained model
        nlp = spacy.load("pt_core_news_sm")
    except OSError:
        try:
            # Fallback to English model if Portuguese isn't downloaded
            nlp = spacy.load("en_core_web_sm")
        except OSError:
            print(json.dumps({"error": "spaCy models not found. Please install: python -m spacy download pt_core_news_sm"}))
            return
            
    doc = nlp(text)
    
    # Extract only ORG (Organizations/Companies) entities
    brands = [ent.text.strip() for ent in doc.ents if ent.label_ == "ORG"]
    
    # Deduplicate and remove empty values
    brands = sorted(list(set([b for b in brands if b])))
    
    # Output as clean JSON for n8n to parse
    print(json.dumps({"brands": brands}))

if __name__ == "__main__":
    main()
