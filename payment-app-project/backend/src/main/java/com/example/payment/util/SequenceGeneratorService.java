package com.example.payment.util;

import com.example.payment.model.Sequence;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import static org.springframework.data.mongodb.core.query.Criteria.where;

/**
 * Generates atomically-incrementing sequence numbers backed by a "sequences" collection,
 * since MongoDB has no native auto-increment. Used for numeric user IDs and for the
 * numeric portion of formatted payment IDs (PAY-000001, PAY-000002, ...).
 */
@Service
public class SequenceGeneratorService {

    private final MongoOperations mongoOperations;

    public SequenceGeneratorService(MongoOperations mongoOperations) {
        this.mongoOperations = mongoOperations;
    }

    public long nextValue(String sequenceName) {
        Sequence counter = mongoOperations.findAndModify(
                Query.query(where("_id").is(sequenceName)),
                new Update().inc("value", 1),
                FindAndModifyOptions.options().returnNew(true).upsert(true),
                Sequence.class);
        return counter != null ? counter.getValue() : 1;
    }
}
